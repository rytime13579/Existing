// utils/downscaleImage.js
export async function downscaleImage(file, maxW = 512, maxH = 512, mime = "image/webp", quality = 0.82) {
    const img = await new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = URL.createObjectURL(file);
    });
    const r = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
    const w = Math.round(img.naturalWidth * r);
    const h = Math.round(img.naturalHeight * r);
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    const blob = await new Promise(res => canvas.toBlob(res, mime, quality));
    return new File([blob], `avatar.${mime.split("/")[1]}`, { type: mime });
}
