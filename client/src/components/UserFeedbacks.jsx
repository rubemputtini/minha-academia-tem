import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert, Card, CardContent, Divider } from "@mui/material";
import { getUserFeedbacks } from "../services/feedbackService";

const UserFeedbacks = ({ userId }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await getUserFeedbacks(userId);
                setFeedbacks(response || []);
            } catch (err) {
                setError("Erro ao carregar os feedbacks do usuário.");
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, [userId]);

    return (
        <Box
            sx={{
                marginTop: "30px",
                backgroundColor: "#1e1e1e",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    color: "#FFCD54",
                    fontWeight: "bold",
                    marginBottom: "10px",
                }}
            >
                Feedbacks do Usuário
            </Typography>
            <Divider sx={{ marginBottom: "20px", backgroundColor: "#333" }} />
            {loading ? (
                <Box my={22} display="flex" justifyContent="center">
                    <CircularProgress color="primary" />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : feedbacks.length > 0 ? (
                feedbacks.map((feedback) => (
                    <Card
                        key={feedback.feedbackId}
                        sx={{
                            backgroundColor: "#2c2c2c",
                            color: "white",
                            marginBottom: "15px",
                            padding: "15px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        }}
                    >
                        <CardContent>
                            <Typography variant="body1" gutterBottom>
                                {feedback.message}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#aaa" }}>
                                Enviado em: {new Date(feedback.createdAt).toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Alert severity="info">Nenhum feedback encontrado.</Alert>
            )}
        </Box>
    );
};

export default UserFeedbacks;
