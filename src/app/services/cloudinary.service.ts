import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ADMIN_API_BASE_URL } from './admin-api.config';

interface CloudinarySignature {
  cloudName: string;
  apiKey: string;
  signature: string;
  timestamp: number;
  folder: string;
}

interface CloudinaryUploadResponse {
  secure_url: string;
}

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  constructor(private http: HttpClient) {}

  async uploadImage(file: File, folder: string): Promise<string> {
    const signature = await firstValueFrom(
      this.http.post<CloudinarySignature>(
        `${ADMIN_API_BASE_URL}/cloudinary/signature`,
        { folder },
        { withCredentials: true }
      )
    );

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signature.apiKey);
    formData.append('timestamp', String(signature.timestamp));
    formData.append('signature', signature.signature);
    formData.append('folder', signature.folder);

    const response = await firstValueFrom(
      this.http.post<CloudinaryUploadResponse>(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/image/upload`,
        formData
      )
    );

    if (!response.secure_url) {
      throw new Error('Cloudinary did not return a secure image URL.');
    }

    return response.secure_url;
  }

  async uploadAudio(file: File, folder: string): Promise<string> {
    const signature = await firstValueFrom(
      this.http.post<CloudinarySignature>(
        `${ADMIN_API_BASE_URL}/cloudinary/signature`,
        { folder, resourceType: 'video' },
        { withCredentials: true }
      )
    );

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signature.apiKey);
    formData.append('timestamp', String(signature.timestamp));
    formData.append('signature', signature.signature);
    formData.append('folder', signature.folder);

    const response = await firstValueFrom(
      this.http.post<CloudinaryUploadResponse>(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/video/upload`,
        formData
      )
    );

    if (!response.secure_url) {
      throw new Error('Cloudinary did not return a secure audio URL.');
    }

    return response.secure_url;
  }
}
