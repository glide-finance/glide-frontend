

export const formatValue = (num: any, dec: number) => {
    const number = window.BigInt(num);
    const round = window.BigInt(10 ** Number(dec));
    const value = Number((number * window.BigInt(1000)) / round) / 1000;
    return value.toFixed(4);
};

const countDecimals = (value: any) => {
    if (Math.floor(value) === value) return 0;
    return value.toString().split('.')[1].length || 0;
};

export const parseValue = (num: any, dec: number) => {
    if (!num) {
        return window.BigInt(0);
    }
    const number = Number(num);
    const numberDec = countDecimals(number);
    const round = window.BigInt(10 ** Number(dec));
    const value =
        (window.BigInt(Math.floor(number * 10 ** numberDec)) * round) /
        window.BigInt(10 ** numberDec);
    return value;
};

export const fetchGasPrice = async (provider: any) => {
    const gasPrice = await provider.getGasPrice()
    return gasPrice
}