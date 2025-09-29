import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, PawPrint, PlusCircle } from "lucide-react";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();

  // Redireciona se não estiver autenticado ou não for admin
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Dashboard Administrativo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card de Gerenciamento de Adotantes */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-medium">Gerenciar Adotantes</CardTitle>
              <Users className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Visualize, adicione, edite e remova adotantes.</p>
              <Button asChild>
                <Link to="/admin/adotantes">
                  <Users className="h-4 w-4 mr-2" />
                  Ver Adotantes
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card de Gerenciamento de Pets */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-medium">Gerenciar Pets</CardTitle>
              <PawPrint className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Visualize, adicione, edite e remova pets.</p>
              <Button asChild>
                <Link to="/admin/pets">
                  <PawPrint className="h-4 w-4 mr-2" />
                  Ver Pets
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card de Cadastro Rápido de Pet */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-medium">Cadastrar Novo Pet</CardTitle>
              <PlusCircle className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Adicione rapidamente um novo pet para adoção.</p>
              <Button asChild>
                <Link to="/#register-pet">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Cadastrar Pet
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
