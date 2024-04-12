const formatNumber = (number) => {
    const formattedInteger = number.toLocaleString('en-US', { maximumFractionDigits: 0 });
    const fractionalPart = (number % 1).toFixed(6).slice(2);
    return `${formattedInteger}.${fractionalPart}`;    
};

export default formatNumber;