export const CategoryType = {
  EXPENSE: "EXPENSE",
  INCOME: "INCOME",
} as const;

export type CategoryType = (typeof CategoryType)[keyof typeof CategoryType];

export const defaultCategories = [
  // Expense Categories
  {
    name: "Alimentação",
    icon: "utensils",
    color: "#E91E63",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Assinaturas e serviços",
    icon: "receipt",
    color: "#9C27B0",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Bares e restaurantes",
    icon: "wine",
    color: "#673AB7",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Casa",
    icon: "home",
    color: "#3F51B5",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Compras",
    icon: "shopping-cart",
    color: "#2196F3",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Cuidados pessoais",
    icon: "heart",
    color: "#03A9F4",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Dívidas e empréstimos",
    icon: "credit-card",
    color: "#00BCD4",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Educação",
    icon: "graduation-cap",
    color: "#009688",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Família e filhos",
    icon: "heart",
    color: "#4CAF50",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Impostos e taxas",
    icon: "receipt",
    color: "#8BC34A",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Investimentos",
    icon: "trending-up",
    color: "#CDDC39",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Lazer e hobbies",
    icon: "gamepad",
    color: "#FFC107",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Mercado",
    icon: "shopping-cart",
    color: "#FF9800",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Outros",
    icon: "tag",
    color: "#FF5722",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Pets",
    icon: "heart",
    color: "#795548",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Presentes e doações",
    icon: "gift",
    color: "#9E9E9E",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Roupas",
    icon: "shopping-bag",
    color: "#607D8B",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Saúde",
    icon: "stethoscope",
    color: "#E91E63",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Farmácia",
    icon: "pill",
    color: "#9C27B0",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Trabalho",
    icon: "briefcase",
    color: "#673AB7",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Transporte",
    icon: "car",
    color: "#3F51B5",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Viagem",
    icon: "plane",
    color: "#2196F3",
    type: CategoryType.EXPENSE,
  },

  // Income Categories
  {
    name: "Empréstimos",
    icon: "credit-card",
    color: "#4CAF50",
    type: CategoryType.INCOME,
  },
  {
    name: "Investimentos",
    icon: "trending-up",
    color: "#8BC34A",
    type: CategoryType.INCOME,
  },
  {
    name: "Outras receitas",
    icon: "dollar-sign",
    color: "#CDDC39",
    type: CategoryType.INCOME,
  },
  {
    name: "Salário",
    icon: "wallet",
    color: "#FFC107",
    type: CategoryType.INCOME,
  },
];
