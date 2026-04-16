import { IsNotEmpty, IsEmail, MinLength, IsOptional, IsEnum, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Le prénom est requis' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'Le nom est requis' })
  @IsString()
  lastName: string;

  @IsNotEmpty({ message: "L'email est requis" })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, { message: 'Mot de passe trop court (min 6 caractères)' })
  password: string;

  @IsOptional()
  @IsEnum(['student', 'professeur'], { message: 'Rôle invalide' })
  role?: string;

  @IsOptional()
  @IsString()
  filiere?: string;

  @IsOptional()
  @IsString()
  niveau?: string;

  @IsOptional()
  @IsString()
  group?: string;

  @IsOptional()
  @IsString()
  departement?: string;
}