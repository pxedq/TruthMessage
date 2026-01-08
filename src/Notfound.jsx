import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "24px",
        gap: "16px",
      }}
    >
      <Typography variant="h2" fontWeight={600}>
        404
      </Typography>

      <Typography variant="h6" color="text.primary">
        Az oldal nem található
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: "420px" }}
      >
        A keresett oldal nem létezik, vagy a hivatkozás hibás.
        Lehet, hogy az oldal törlésre került vagy megváltozott az elérési útja.
      </Typography>

      <Button
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={() => navigate("/")}
      >
        Vissza a főoldalra
      </Button>
    </div>
  );
}
