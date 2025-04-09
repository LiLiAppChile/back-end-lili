import { Module } from '@nestjs/common';
import { FirebaseAdminService } from './services/firebase-admin.service'; // Asegúrate de que la ruta sea correcta
import { FirebaseAuthGuard } from './firebase-auth.guard'; // Asegúrate de que la ruta sea correcta

@Module({
  providers: [FirebaseAdminService, FirebaseAuthGuard], // Proporciona el servicio y el guard
  exports: [FirebaseAdminService, FirebaseAuthGuard], // Exporta el servicio y el guard
})
export class FirebaseAuthModule {}