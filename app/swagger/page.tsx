import { SwaggerComponent } from "@/components/swagger-ui";

export const metadata = {
  title: "StatCore - API Documentation",
  description: "Documentação da API StatCore com Swagger/OpenAPI",
};

export default function SwaggerPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold">StatCore API Documentation</h1>
        <p className="mt-2 text-blue-100">
          Documentação completa dos endpoints disponíveis na API StatCore
        </p>
      </div>

      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <SwaggerComponent />
        </div>
      </div>

      <div className="bg-gray-100 border-t p-6 mt-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Informações de Conexão</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded border">
              <h3 className="font-semibold mb-2">Frontend</h3>
              <code className="text-sm bg-gray-200 p-2 block">
                http://localhost:3000
              </code>
            </div>
            <div className="bg-white p-4 rounded border">
              <h3 className="font-semibold mb-2">Backend Python</h3>
              <code className="text-sm bg-gray-200 p-2 block">
                https://localhost:8000
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
