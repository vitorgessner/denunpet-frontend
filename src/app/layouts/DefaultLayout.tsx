import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { BadgeAlert, ClipboardList, PawPrint } from 'lucide-react';
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { UserType } from "@/features/auth/types";
import { Button } from "@/components/ui/button";

export function DefaultLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout: _logout } = useAuth();

    const logout = () => {
        _logout();
        navigate('/login');
    }

    return (
        <div className="shell max-w-4xl w-full mx-auto">
            {/* Topbar */}
            <div className="topbar">
                <div className="flex w-full gap-3 justify-between">
                    <div className="brand">
                        <span className="brand-mark" aria-hidden="true">
                            <PawPrint size={21} />
                        </span>
                        <b>DenunPet</b>
                    </div>

                    <div className="flex gap-3">
                        {user
                            ? <>
                                <Button onClick={logout}>
                                    Sair
                                </Button>
                            </>
                            : <>
                                <Link to="/login">
                                    <Button>
                                        Login
                                    </Button>
                                </Link>
                            </>}
                    </div>
                </div>
            </div>

            {/* Page Content */}
            <main className="page w-full">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <div className="bottom-nav">
                <nav className={`grid gap-2.5 py-2 px-4 ${user?.type == UserType.ONG ? 'grid-cols-2' : 'grid-cols-1'} 
                `} aria-label="Navegação principal">
                    {user?.type && (
                        <Link
                            to="/my-reports"
                            className={`navBtn flex-1 p-2 ${location.pathname === '/my-reports' ? 'active' : ''}`}
                            aria-label="Minhas denúncias"
                        >
                            {user.type === UserType.USER ? <BadgeAlert /> : <ClipboardList />}
                            <span>Minhas denúncias</span>
                        </Link>
                    )}
                    {user?.type === UserType.ONG && (
                        <Link
                            to="/pending-reports"
                            className={`navBtn flex-1 p-2 ${location.pathname === '/pending-reports' ? 'active' : ''}`}
                            aria-label="Denúncias abertas"
                        >
                            <BadgeAlert />
                            <span>Fila de triagem</span>
                        </Link>
                    )}
                </nav>
            </div>
        </div>
    );
}
