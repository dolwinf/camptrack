import React, { useState, useContext } from "react";
import { withStyles } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import Divider from "@material-ui/core/Divider";

import { CREATE_COMMENT_MUTATION } from "../../graphql/mutations";
import { useClient } from "../../client";
import context from "../../context";

const CreateComment = ({ classes }) => {
  //local state to save data from the input field and pass the current state (which will be the comment text to the graphql request client)
  const [comment, setComment] = useState("");
  const client = useClient();
  const { state, dispatch } = useContext(context);

  const handleSubmitComment = async () => {
    const variables = { pinID: state.currentPin._id, text: comment };
    const { createComment } = await client.request(
      CREATE_COMMENT_MUTATION,
      variables
    );
    dispatch({ type: "CREATE_COMMENT", payload: createComment });
    setComment("");
  };
  return (
    <>
      <form className={classes.form}>
        <IconButton
          disabled={!comment.trim()}
          className={classes.clearButton}
          onClick={() => setComment("")}
        >
          <ClearIcon />
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder="Add Comment"
          multiline={true}
          onChange={e => setComment(e.target.value)}
          value={comment}
        ></InputBase>
        <IconButton
          disabled={!comment.trim()}
          className={classes.sendButton}
          onClick={handleSubmitComment}
        >
          <SendIcon />
        </IconButton>
      </form>
      <Divider />
    </>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    alignItems: "center"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  clearButton: {
    padding: 0,
    color: "red"
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark
  }
});

export default withStyles(styles)(CreateComment);
