export const CREATE_PIN_MUTATION = `mutation($title: String, $image: String, $content: String, $latitude: Float, $longitude: Float, ){
    createPin (input: {
        title: $title,
        image: $image,
        content: $content,
        latitude: $latitude,
        longitude: $longitude
    })
    {
        _id
        createdAt
        title
        image
        content
        latitude
        longitude
        author {
            _id
            name
            email
            picture
        }
    }
}`;

export const DELETE_PIN_MUTATION = `mutation($pinID: ID!){
    deletePin(pinID: $pinID )
    {
        _id
        
    }
}`;

//We're returning a pin from resolvers so we get all it's data which can query for
//We need to fetch all this data because we need to update the data in state to render on the page
export const CREATE_COMMENT_MUTATION = `mutation($pinID: ID!, $text: String!) {

	createComment(pinID: $pinID, text: $text){
        _id
        createdAt
        title
        content
        image
        latitude
        longitude
        author {
            _id
            name
        }
        comments {
            text
            createdAt
            author {
                name
                picture
            }
        }

    }
}`;
