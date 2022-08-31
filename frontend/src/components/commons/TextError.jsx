function TextError(props) {
  const errorStyles = {
    fontSize: "13px",
    color: "#ec0909",
    display: "flex",
  };

  return (
    <div style={errorStyles} className="error">
      {props.children}
    </div>
  );
}

export default TextError;
