import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import PropTypes from "prop-types";
import "./ModalsGlobal.css";

/**
 * Componente Modal Moderno Reutilizable
 * Aplicaestilos consistentes con el tema rojo/negro de Taekwondo
 */
export default function ModernModal({
  open,
  onClose,
  title,
  icon,
  children,
  actions,
  maxWidth = "sm",
  fullWidth = true,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      className="modal-modern"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(220, 20, 60, 0.1)",
          overflow: "visible",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(10, 10, 10, 0.7)",
        },
      }}
    >
      {/* Header con gradiente */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #DC143C 0%, #B22222 50%, #8B0000 100%)",
          color: "white",
          padding: "24px 32px",
          position: "relative",
          overflow: "hidden",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)",
            animation: "modalPulse 4s ease-in-out infinite",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {icon && (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255, 255, 255, 0.15)",
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                }}
              >
                {icon}
              </Box>
            )}
            <Box
              component="h2"
              sx={{
                margin: 0,
                fontSize: "1.75rem",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
              }}
            >
              {title}
            </Box>
          </Box>

          <IconButton
            onClick={onClose}
            className="modal-close-button"
            sx={{
              color: "white",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "10px",
              width: 40,
              height: 40,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.2)",
                transform: "rotate(90deg) scale(1.1)",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Contenido */}
      <DialogContent
        className="modal-content"
        sx={{
          padding: "32px",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        {children}
      </DialogContent>

      {/* Footer con acciones */}
      {actions && (
        <DialogActions
          className="modal-footer"
          sx={{
            padding: "20px 32px 32px",
            background: "linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 100%)",
            gap: 1.5,
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}

ModernModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
  actions: PropTypes.node,
  maxWidth: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  fullWidth: PropTypes.bool,
};
