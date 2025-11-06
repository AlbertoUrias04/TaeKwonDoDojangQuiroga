# Guía de Uso: Modales Modernos

## Descripción
Sistema de modales modernos con diseño consistente rojo/negro para Taekwondo Dojang Quiroga.

## Características
- ✅ Header con gradiente rojo
- ✅ Animaciones suaves de entrada
- ✅ Backdrop con blur
- ✅ Botones con gradientes
- ✅ Scrollbar personalizado
- ✅ Responsive
- ✅ Iconos en headers
- ✅ Transiciones fluidas

## Cómo Usar

### 1. Importar el componente y estilos

```javascript
import ModernModal from "../modals/ModernModal";
import { PersonAdd } from "@mui/icons-material";
import { Button } from "@mui/material";
import "../modals/ModalsGlobal.css";
```

### 2. Ejemplo Básico

```javascript
<ModernModal
  open={modalAbierto}
  onClose={() => setModalAbierto(false)}
  title="Nuevo Alumno"
  icon={<PersonAdd />}
  actions={
    <>
      <Button
        onClick={() => setModalAbierto(false)}
        className="modal-button-secondary"
      >
        Cancelar
      </Button>
      <Button
        onClick={handleGuardar}
        className="modal-button-primary"
        disabled={guardando}
      >
        {guardando ? "Guardando..." : "Guardar"}
      </Button>
    </>
  }
>
  {/* Tu contenido aquí */}
  <TextField
    fullWidth
    label="Nombre"
    variant="outlined"
  />
</ModernModal>
```

### 3. Ejemplo con Formulario Completo

```javascript
import { useState } from "react";
import ModernModal from "../modals/ModernModal";
import { PersonAdd } from "@mui/icons-material";
import { TextField, Button, Grid } from "@mui/material";

export default function ModalEjemplo({ abierto, cerrar }) {
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async () => {
    setGuardando(true);
    // Tu lógica aquí
    setGuardando(false);
    cerrar();
  };

  return (
    <ModernModal
      open={abierto}
      onClose={cerrar}
      title="Nuevo Alumno"
      icon={<PersonAdd />}
      maxWidth="md"
      actions={
        <>
          <Button
            onClick={cerrar}
            className="modal-button-secondary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleGuardar}
            className="modal-button-primary"
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar"}
          </Button>
        </>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nombre"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Apellido"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </ModernModal>
  );
}
```

## Props del ModernModal

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `open` | boolean | ✅ | - | Controla si el modal está abierto |
| `onClose` | function | ✅ | - | Función que se ejecuta al cerrar |
| `title` | string | ✅ | - | Título del modal |
| `icon` | node | ❌ | null | Ícono para el header |
| `children` | node | ✅ | - | Contenido del modal |
| `actions` | node | ❌ | null | Botones del footer |
| `maxWidth` | string | ❌ | "sm" | Tamaño máximo: xs, sm, md, lg, xl |
| `fullWidth` | boolean | ❌ | true | Si ocupa todo el ancho |

## Clases CSS Disponibles

### Botones
- `.modal-button-primary` - Botón rojo con gradiente
- `.modal-button-secondary` - Botón blanco con borde

### Contenedores
- `.modal-header` - Header con gradiente
- `.modal-content` - Contenido principal
- `.modal-footer` - Footer con botones

### Elementos
- `.modal-header-icon` - Ícono del header
- `.modal-close-button` - Botón de cerrar
- `.modal-divider` - Separador personalizado

## Iconos Recomendados (Material-UI)

```javascript
import {
  PersonAdd,      // Crear alumno
  Edit,           // Editar
  Payment,        // Pagos
  Class,          // Clases
  CardMembership, // Membresías
  Groups,         // Usuarios
  CheckCircle,    // Confirmar
  Warning,        // Advertencia
  Info,           // Información
} from "@mui/icons-material";
```

## Personalización

Si necesitas estilos adicionales, puedes usar `sx` prop:

```javascript
<ModernModal
  open={abierto}
  onClose={cerrar}
  title="Título"
  sx={{
    "& .MuiDialog-paper": {
      maxWidth: "800px",
    },
  }}
>
  {/* Contenido */}
</ModernModal>
```

## Ejemplos de Uso por Módulo

### Alumnos
```javascript
<ModernModal title="Nuevo Alumno" icon={<PersonAdd />} />
<ModernModal title="Editar Alumno" icon={<Edit />} />
```

### Usuarios
```javascript
<ModernModal title="Nuevo Usuario" icon={<Groups />} />
```

### Pagos
```javascript
<ModernModal title="Registrar Pago" icon={<Payment />} />
```

### Clases
```javascript
<ModernModal title="Nueva Clase" icon={<Class />} />
```

### Conceptos
```javascript
<ModernModal title="Nuevo Concepto" icon={<CardMembership />} />
```

## Animaciones

Todos los modales incluyen:
- Entrada suave con slide y scale
- Fade in del contenido escalonado
- Efecto pulse en el header
- Hover effects en botones
- Rotación del botón cerrar al hover

## Responsive

Los modales se adaptan automáticamente a pantallas pequeñas:
- Padding reducido
- Botones apilados verticalmente
- Ancho del 100% menos margen

## Soporte

Para dudas o problemas, consulta con el equipo de desarrollo.
