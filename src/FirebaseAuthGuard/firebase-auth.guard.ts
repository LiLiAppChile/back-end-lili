import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseAdminService } from './services/firebase-admin.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      const decodedToken = await this.firebaseAdmin.verifyToken(token);

      // Añadir verificación de null para decodedToken
      if (!decodedToken) {
        throw new UnauthorizedException('Token inválido');
      }

      // Ahora TypeScript sabe que decodedToken no es null
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        throw new UnauthorizedException('Token expirado');
      }

      request.user = decodedToken;
      return true;
    } catch (error) {
      console.error('Error verificando token:', error);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
