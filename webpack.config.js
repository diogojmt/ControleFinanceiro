const path = require('path');

module.exports = {
    entry: './src/index.js', // O arquivo principal de entrada do JS
    output: {
        filename: 'bundle.js', // O arquivo de saída
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development', // Pode mudar para 'production' quando for o caso
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Necessário se quiser suporte a versões mais antigas de JS
                },
            },
        ],
    },
};
