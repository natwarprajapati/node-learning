
export const getReviewById = (req, res) => {
    const { id } = req.params || {};


    console.log("id---", id);



    res.send(`Your review is fetched by ID. And review ID is ${id}`);
}

export const getReviews = (req, res) => {
    res.send("Your reviews are fetched.");
}

export const addReview = (req, res) => {
    res.send("Your review is added.");
}

export const removeReview = (req, res) => {
    res.send("Your review is removed.");
}