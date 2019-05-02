            <Draggable>
<div className="callImageDivAnwserMain">

    <div className="callPage-recieverImageDiv">

        {/* <MdCallEnd onClick={this.props.endCall} className="img__overlay"/> */}
        <span>
        <MdCallEnd 
        onClick={this.props.endCall}
                        className="img__overlay"
                        style={{
                            padding: "10px"
                        }} />
                        </span>
        <span className="tooltiptext" >
            <div>
                {ProfileHover}

            </div></span>

        {/* <span className="hint--top" aria-label={this.props.otherPersonName}> */}
        <img alt="reciever profile pic"className="callPage-recieverImage" src={this.props.otherPersonPic}></img>
        {/* </span> */}
    </div>
    <div className="callPage-recieverImageDiv endCall">
                <span className="hint--top" aria-label="ShareScreen">
                    <MdFilterNone onClick={this.props.shareMyScreen} className="endButton" />
                </span>
    </div>
    <div fontSize="13px"style={{color:"white"}}>
    <Countdown
    
    date={Date.now() + this.props.timeAloted * 60 * 1000}
    renderer={this.props.renderer}
/>
    </div>
   

    {/* <div className="callPage-recieverImageDiv endCall">
        <span className="hint--top" aria-label="End Call">
            <MdCallEnd  className="endButton" />
        </span>
        {/* <span style={{fontSize:"12px"}}>End Call</span> */}
    {/* </div> */}
</div>
</Draggable>