const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Endpoint principal: sirve la página web
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint de salud para validar que la app está viva
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "app-prueba-carga-ec2",
    timestamp: new Date().toISOString()
  });
});

// Endpoint usado por k6 para probar desempeño.
// El retardo artificial simula procesamiento básico de servidor.
app.get("/api/test", async (req, res) => {
  const delayMs = Number(process.env.DELAY_MS || 300);

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  res.status(200).json({
    message: "Solicitud procesada correctamente",
    delay_ms: delayMs,
    instance: "EC2 low cost test",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Aplicación de prueba ejecutándose en http://0.0.0.0:${PORT}`);
});
