export const NUMBER = {
    validate: (val) => !isNaN(val),
    message: 'O valor deve ser numérico.'
};

export const EMPTY = {
    validate: (val) => val !== '' && val !== null,
    message: 'O valor não deve ser vazio.'
};
