"""
Extract frames from covid19_ultrasound repo into binary normal/abnormal structure.

Label mapping (by filename prefix):
  Reg_ / Reg-   -> normal
  Cov_ / Cov-   -> abnormal
  Pneu_ / Pneu- -> abnormal
  Vir_          -> abnormal

Sources:
  pocus_images/ (jpg/png) -> copy directly
  pocus_videos/ (mp4/avi/mov/mpeg/gif) -> extract N frames per video via OpenCV

Patient-ID derivation: first two underscore-separated parts of stem,
so all frames from one video share a patient_id for patient-level splits.

Usage:
  python scripts/extract_openpocus_frames.py \
      --source D:/jeevika/covid19_us/data \
      --output data/raw \
      --frames_per_video 5
"""

import argparse
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


VIDEO_EXTS = {".mp4", ".mov", ".avi", ".mpeg", ".mpg"}
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp"}

PREFIX_LABEL = {
    "reg": "normal",
    "cov": "abnormal",
    "pneu": "abnormal",
    "vir": "abnormal",
}


def get_label(stem: str):
    lower = stem.lower()
    for prefix, label in PREFIX_LABEL.items():
        if lower.startswith(prefix):
            return label
    return None


def patient_id_from_stem(stem: str) -> str:
    """
    Two-part prefix for patient-level splits.

    e.g. Reg_pat1Image_132943 -> REG_PAT1
         Pneu_northumbria_0409_set1_vid1 -> PNEU_NORTHUMBRIA
    """
    parts = stem.replace("-", "_").split("_")
    return "_".join(parts[:2]).upper()


def safe_stem(stem: str) -> str:
    """Sanitize stem for use as filename component."""
    import re

    return re.sub(r"[^A-Za-z0-9_]", "_", stem)[:60]


def extract_video_frames(
    video_path: Path,
    out_dir: Path,
    n_frames: int,
    stem: str,
) -> int:
    cap = cv2.VideoCapture(str(video_path))

    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    if total <= 0:
        cap.release()
        return 0

    indices = np.linspace(
        0,
        max(0, total - 1),
        min(n_frames, total),
        dtype=int,
    )

    pid = patient_id_from_stem(stem)
    vid_id = safe_stem(stem)

    saved = 0

    for i, idx in enumerate(indices):
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(idx))

        ret, frame = cap.read()

        if not ret:
            continue

        cv2.imwrite(
            str(out_dir / f"{pid}_{vid_id}_f{i:02d}.png"),
            frame,
        )

        saved += 1

    cap.release()

    return saved


def extract_gif_frames(
    gif_path: Path,
    out_dir: Path,
    n_frames: int,
    stem: str,
) -> int:

    try:
        img = Image.open(gif_path)
    except Exception:
        return 0

    frames = []

    try:
        while True:
            frames.append(img.copy().convert("RGB"))
            img.seek(img.tell() + 1)

    except EOFError:
        pass

    if not frames:
        return 0

    indices = np.linspace(
        0,
        len(frames) - 1,
        min(n_frames, len(frames)),
        dtype=int,
    )

    pid = patient_id_from_stem(stem)
    vid_id = safe_stem(stem)

    for i, idx in enumerate(indices):
        frames[int(idx)].save(
            out_dir / f"{pid}_{vid_id}_f{i:02d}.png"
        )

    return len(indices)


def copy_image(
    src: Path,
    out_dir: Path,
    stem: str,
) -> int:

    pid = patient_id_from_stem(stem)
    vid_id = safe_stem(stem)

    Image.open(src).convert("RGB").save(
        out_dir / f"{pid}_{vid_id}_img.png"
    )

    return 1


def main():

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--source",
        default="D:/jeevika/covid19_us/data",
    )

    parser.add_argument(
        "--output",
        default="data/raw",
    )

    parser.add_argument(
        "--frames_per_video",
        type=int,
        default=5,
    )

    args = parser.parse_args()

    source = Path(args.source)
    output = Path(args.output)

    (output / "normal").mkdir(
        parents=True,
        exist_ok=True,
    )

    (output / "abnormal").mkdir(
        parents=True,
        exist_ok=True,
    )

    counts = {
        "normal": 0,
        "abnormal": 0,
        "skipped": 0,
    }

    # --------------------------------------------------
    # Process images
    # --------------------------------------------------

    pocus_images = source / "pocus_images"

    if pocus_images.exists():

        for probe_dir in pocus_images.iterdir():

            if not probe_dir.is_dir():
                continue

            for f in probe_dir.iterdir():

                if f.suffix.lower() not in IMAGE_EXTS:
                    continue

                label = get_label(f.stem)

                if label is None:
                    counts["skipped"] += 1
                    continue

                try:

                    n = copy_image(
                        f,
                        output / label,
                        f.stem,
                    )

                    counts[label] += n

                except Exception as e:

                    print(
                        f"[WARN] {f.name}: {e}"
                    )

    # --------------------------------------------------
    # Process videos
    # --------------------------------------------------

    pocus_videos = source / "pocus_videos"

    if pocus_videos.exists():

        for probe_dir in pocus_videos.iterdir():

            if (
                not probe_dir.is_dir()
                or probe_dir.name == "label_uncertain"
            ):
                continue

            for f in sorted(probe_dir.iterdir()):

                if not f.is_file():
                    continue

                label = get_label(f.stem)

                if label is None:
                    counts["skipped"] += 1
                    continue

                ext = f.suffix.lower()

                try:

                    if ext == ".gif":

                        n = extract_gif_frames(
                            f,
                            output / label,
                            args.frames_per_video,
                            f.stem,
                        )

                    elif ext in VIDEO_EXTS:

                        n = extract_video_frames(
                            f,
                            output / label,
                            args.frames_per_video,
                            f.stem,
                        )

                    else:

                        counts["skipped"] += 1
                        continue

                    counts[label] += n

                    if n > 0:
                        print(
                            f"  [{label}] {f.name} -> {n} frames"
                        )

                except Exception as e:

                    print(
                        f"[WARN] {f.name}: {e}"
                    )

                    counts["skipped"] += 1

    # --------------------------------------------------
    # Summary
    # --------------------------------------------------

    print("\nDone.")

    print(
        f"  normal frames:   {counts['normal']:,}"
    )

    print(
        f"  abnormal frames: {counts['abnormal']:,}"
    )

    print(
        f"  skipped:         {counts['skipped']}"
    )

    print(
        f"  Output: {output.resolve()}"
    )


if __name__ == "__main__":
    main()
