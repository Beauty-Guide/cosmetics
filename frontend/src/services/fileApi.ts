import apiClient from '@/hooks/apiClient';

export const uploadCosmeticImages = async (
    cosmeticId: number,
    files: File[],
    isMain: boolean = false
): Promise<void> => {
    if (!files.length) {
        throw new Error('Нет изображений для загрузки');
    }

    // Используем Promise.all для обработки всех промисов
    await Promise.all(
        files.map(async (file, index) => {
            const formData = new FormData();
            formData.append('image', file);
            try {
                await apiClient.post(`/admin/files/upload?cosmeticId=${cosmeticId}&isMain=${isMain}`, formData);
            } catch (err: any) {
                const message = err.response?.data?.message
                    || err.message
                    || 'Ошибка при загрузке изображений';

                throw new Error(message);
            }
        })
    );
};


// === Отдельный метод для получения URL по имени файла ===
const fetchImageUrlAfterUpload = async (fileName: string): Promise<string> => {
    try {
        const urlResponse = await apiClient.get(`/api/files/${fileName}`);
        return urlResponse.data; // должен вернуть URL, например: "https://minio.example.com/... "
    } catch (err: any) {
        const message = err.response?.data?.message
            || err.message
            || 'Ошибка при получении URL изображения';
        throw new Error(message);
    }
};

