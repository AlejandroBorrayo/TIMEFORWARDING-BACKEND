export const shipmentStatusesSoloenvios = [
  {
    status: "created",
    description:
      "La guía fue creada.",
  },
  {
    status: "exception",
    description:
      "Ocurrió un problema con el envío.",
  },
  {
    status: "picked_up",
    description: "El paquete fue recogido por el transportista.",
  },
  {
    status: "in_transit",
    description: "El paquete está en camino hacia el destino.",
  },
  {
    status: "last_mile",
    description:
      "El paquete está en la etapa final de entrega al destinatario.",
  },
  {
    status: "delivery_attempt",
    description:
      "Se intentó entregar el paquete, pero no se logró completar la entrega.",
  },
  {
    status: "delivered",
    description: "El paquete fue entregado exitosamente al destinatario.",
  },
  {
    status: "delivered_to_branch",
    description: "El paquete fue entregado en una sucursal para ser recogido.",
  },
  {
    status: "in_return",
    description: "El paquete está en proceso de devolución al remitente.",
  },
  { status: "cancelled", description: "El envío fue cancelado." },
];

export function getShipmentStatusSoloenviosDescription(status: string): string {
    const item = shipmentStatusesSoloenvios.find(s => s.status === status);
    return item ? item.description : "Estatus desconocido.";
  }