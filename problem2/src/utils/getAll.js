import axios from "axios";

const getAll = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json"
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching car types data:", error);
    throw error;
  }
};

export default getAll;