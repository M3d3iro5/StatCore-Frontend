"use client";

import dynamic from "next/dynamic";
import { swaggerConfig } from "@/lib/swagger-config";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });
import "swagger-ui-react/swagger-ui.css";

export function SwaggerComponent() {
  return (
    <SwaggerUI
      spec={swaggerConfig}
      defaultModelsExpandDepth={1}
      defaultModelExpandDepth={1}
      persistAuthorization={true}
      displayOperationId={true}
      filter={true}
    />
  );
}
