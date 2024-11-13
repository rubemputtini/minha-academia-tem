import instagram from "../assets/instagram.svg";
import youtube from "../assets/youtube.svg";

export const API_URL = process.env.REACT_APP_API_URL;

export const socialMedia = [
    {
      id: "social-media-1",
      icon: instagram,
      link: "https://www.instagram.com/rubemputtini/",
    },
    {
      id: "social-media-2",
      icon: youtube,
      link: "https://www.youtube.com/channel/UCtd2KtLMi5YySEqpvWYl9ag?sub_confirmation=1",
    }
  ];

export const errorMessages = {
    "Passwords must be at least 6 characters.": "A senha deve ter pelo menos 6 caracteres.",
    "Passwords must have at least one non alphanumeric character.": "A senha deve conter pelo menos um caractere não alfanumérico.",
    "Passwords must have at least one digit ('0'-'9').": "A senha deve conter pelo menos um dígito.",
    "Passwords must have at least one lowercase ('a'-'z').": "A senha deve conter pelo menos uma letra minúscula.",
    "Passwords must have at least one uppercase ('A'-'Z').": "A senha deve conter pelo menos uma letra maiúscula."
};

export const muscleGroupNames = {
  Peito: "Peito",
  Ombro: "Ombro",
  Costas: "Costas",
  Pernas: "Pernas",
  Bíceps: "Bíceps",
  Tríceps: "Tríceps",
  Abdômen: "Abdômen"
};
