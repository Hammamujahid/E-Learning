<?php

namespace App\Services;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Wraps Cloudinary uploads so controllers do not repeat option arrays and so
 * the whole integration can be faked in tests via the container.
 */
class MediaUploader
{
    /**
     * Upload a document (pdf, doc, ppt, xls) as a raw asset.
     *
     * @return array{url: string, public_id: string}
     */
    public function uploadDocument(UploadedFile $file, string $folder = 'e-learning'): array
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);

        return $this->upload($file, [
            'folder' => $folder,
            'resource_type' => 'raw',
            'public_id' => Str::slug($originalName).'-'.time(),
            'filename_override' => $file->getClientOriginalName(),
            'use_filename' => true,
        ]);
    }

    /**
     * Upload an image asset.
     *
     * @return array{url: string, public_id: string}
     */
    public function uploadImage(UploadedFile $file, string $folder, string $prefix): array
    {
        return $this->upload($file, [
            'folder' => $folder,
            'public_id' => $prefix.'-'.Str::random(8).'-'.time(),
        ]);
    }

    /**
     * Remove an asset, ignoring failures so a missing remote file never blocks
     * a database write.
     */
    public function destroy(?string $publicId, bool $raw = false): void
    {
        if (! $publicId) {
            return;
        }

        try {
            Cloudinary::uploadApi()->destroy($publicId, $raw ? ['resource_type' => 'raw'] : []);
        } catch (\Throwable) {
            // The asset is already gone or unreachable; nothing to clean up.
        }
    }

    /**
     * @param  array<string, mixed>  $options
     * @return array{url: string, public_id: string}
     */
    protected function upload(UploadedFile $file, array $options): array
    {
        try {
            $result = Cloudinary::uploadApi()->upload($file->getRealPath(), $options);
        } catch (\Throwable $e) {
            throw new RuntimeException('Gagal mengunggah berkas: '.$e->getMessage(), previous: $e);
        }

        return [
            'url' => $result['secure_url'],
            'public_id' => $result['public_id'],
        ];
    }
}
