import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useHookFormMask } from 'use-mask-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { api } from '@/lib/api';
import { UserType } from '../types';

const registerSchema = z
    .object({
        email: z.string().email('Email inválido'),
        name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
        password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
        confirmPassword: z.string(),
        phone: z.string().optional(),
        type: z.enum(UserType),
        cpf: z.string().optional().nullable(),
        cnpj: z.string().optional().nullable(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ['confirmPassword'],
    })
    .refine(
        (data) => {
            if (data.type === UserType.USER) {
                data.cnpj = null
                return data.cpf && data.cpf.length > 0;
            }
            return true;
        },
        {
            message: 'CPF é obrigatório para usuários',
            path: ['cpf'],
        }
    )
    .refine(
        (data) => {
            if (data.type === UserType.ONG) {
                data.cpf = null
                return data.cnpj && data.cnpj.length > 0;
            }
            return true;
        },
        {
            message: 'CNPJ é obrigatório para organizações',
            path: ['cnpj'],
        }
    );

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            type: UserType.USER,
        },
    });
    const registerWithMask = useHookFormMask(register);

    const userType = watch('type');

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setError('');

        try {
            const { confirmPassword, ...userData } = data;

            const response = await api.post('/api/auth/register', userData);

            const { token } = await response.data;
            localStorage.setItem('token', token);
            window.location.href = '/'
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro durante o cadastro');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page flex justify-center px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
                    <CardDescription>
                        Preencha as informações abaixo para criar sua conta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label>Tipo de Conta</Label>
                            <RadioGroup
                                defaultValue={UserType.USER}
                                onValueChange={(value) => {
                                    const event = {
                                        target: { name: 'type', value },
                                    };
                                    register('type').onChange(event);
                                }}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={UserType.USER} id="user" />
                                    <Label htmlFor="user" className="font-normal">
                                        Usuário
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={UserType.ONG} id="ong" />
                                    <Label htmlFor="ong" className="font-normal">
                                        ONG
                                    </Label>
                                </div>
                            </RadioGroup>
                            {errors.type && (
                                <p className="text-sm text-red-500">{errors.type.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder={userType === UserType.ONG ? 'Nome da ONG' : 'Nome Completo'}
                                {...register('name')}
                                disabled={isLoading}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                {...register('email')}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {userType === UserType.USER && (
                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input
                                    id="cpf"
                                    type="text"
                                    placeholder="000.000.000-00"
                                    {...registerWithMask('cpf', ['999.999.999-99'], { required: true })}
                                    disabled={isLoading}
                                />
                                {errors.cpf && (
                                    <p className="text-sm text-red-500">{errors.cpf.message}</p>
                                )}
                            </div>
                        )}

                        {userType === UserType.ONG && (
                            <div className="space-y-2">
                                <Label htmlFor="cnpj">CNPJ</Label>
                                <Input
                                    id="cnpj"
                                    type="text"
                                    placeholder="00.000.000/0000-00"
                                    {...registerWithMask('cnpj', ['99.999.999/9999-99'], { required: true })}
                                    disabled={isLoading}
                                />
                                {errors.cnpj && (
                                    <p className="text-sm text-red-500">{errors.cnpj.message}</p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone (Opcional)</Label>
                            <Input
                                id="phone"
                                placeholder="(00) 00000-0000"
                                {...registerWithMask('phone', ['(99) 9999-9999', '(99) 99999-9999'], { required: true })}
                                disabled={isLoading}
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-500">{errors.phone.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                disabled={isLoading}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                {...register('confirmPassword')}
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Criando conta...' : 'Criar Conta'}
                        </Button>

                        <div className="text-center text-sm text-gray-600 mt-3">
                            Já tem uma conta?{' '}
                            <Link to="/login" className="font-medium text-primary hover:underline">
                                Entrar
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}