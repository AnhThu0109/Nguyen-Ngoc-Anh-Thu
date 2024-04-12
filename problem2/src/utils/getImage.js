const getCurrencyName = (imgSrc) => {
    return imgSrc.split("/").pop().split(".")[0];
}

const getImage = async (currency, listImages) => {
    for (const item of listImages){
        const currencyName = getCurrencyName(item);
        if(currency.toLowerCase() === currencyName.toLowerCase()){
            return item;
        }
    }
}
export default getImage;