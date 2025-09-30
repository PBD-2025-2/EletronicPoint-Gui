import { HttpInterceptorFn } from "@angular/common/http";

export const authinterceptor: HttpInterceptorFn = (req, next) => {
    const token = sessionStorage.getItem('accessToken');

    if (token) {
        const parsedToken = JSON.parse(atob(token));

        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${parsedToken}`
            }
        });
        return next(cloned);
    }

    return next(req);
}