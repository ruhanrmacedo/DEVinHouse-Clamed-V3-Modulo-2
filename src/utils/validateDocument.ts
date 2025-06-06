// Valida CPF
export const validateCPF = (cpf: string): boolean => {
    if (!cpf) return false;
    const cleanedCPF = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
    return cleanedCPF.length === 11; // Retorna true se tiver 11 dígitos
};

// Valida CNPJ
export const validateCNPJ = (cnpj: string): boolean => {
    if (!cnpj) return false;
    const cleanedCNPJ = cnpj.replace(/\D/g, ""); // Remove caracteres não numéricos
    return cleanedCNPJ.length === 14; // Retorna true se tiver 14 dígitos
};
