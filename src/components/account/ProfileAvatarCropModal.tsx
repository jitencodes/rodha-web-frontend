"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type ProfileAvatarCropModalProps = {
  open: boolean;
  imageSrc: string;
  uploading?: boolean;
  onCancel: () => void;
  onCropped: (blob: Blob) => void;
};

async function getCroppedBlob(
  imageSrc: string,
  crop: Area
): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const size = Math.min(crop.width, crop.height);
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    size,
    size
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Crop failed"));
        else resolve(blob);
      },
      "image/jpeg",
      0.92
    );
  });
}

export function ProfileAvatarCropModal({
  open,
  imageSrc,
  uploading = false,
  onCancel,
  onCropped,
}: ProfileAvatarCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedArea(areaPixels);
  }, []);

  async function handleConfirm() {
    if (!croppedArea || busy) return;
    setBusy(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedArea);
      onCropped(blob);
    } catch {
      setBusy(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      title="Crop profile photo"
      description="Adjust the crop area, then save."
      confirmLabel="Upload"
      cancelLabel="Cancel"
      confirming={busy || uploading}
      onCancel={onCancel}
      onConfirm={() => void handleConfirm()}
    >
      <div className="relative mt-4 h-64 w-full overflow-hidden rounded-lg bg-black/90">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <label className="mt-3 flex items-center gap-3 text-[13px] text-[var(--account-text-muted)]">
        Zoom
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1"
        />
      </label>
    </ConfirmDialog>
  );
}
