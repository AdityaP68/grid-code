

const ActionButtonRenderer = (props) => {
  // Add console logs for debugging

  const handleExpand = () => {
    if (!props.node) {
      console.error('No node found in props');
      return;
    }

    try {
      if (props.node.expanded) {
        props.node.setExpanded(false); // Collapse if already expanded
      } else {
        props.node.setExpanded(true); // Expand the row
      }
    } catch (error) {
      console.error('Error toggling expansion:', error);
    }
  };

  return (
    <button 
      onClick={handleExpand}
      style={{ 
        padding: '0px 10px', 
        backgroundColor: '#3d3d3d',
        borderRadius: "5px", 
        border: "none"
      }}
    >
      {props.node && props.node.expanded ? "Collapse" : "Expand"}
    </button>
  );
};

export default ActionButtonRenderer;