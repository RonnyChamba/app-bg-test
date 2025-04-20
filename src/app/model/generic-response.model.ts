export interface GenericResponse<T> {
    status: number;
    message: string;
    data: T;
}