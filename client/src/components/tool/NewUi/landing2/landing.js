import React from 'react';
import './landing2.css';
import Form from './Form'

export default () => {
    return (
        <div className="landingMainContain">
            <div className="logoEmail">
                <img alt="logo" height="70%" width="70%" src={require('../../../images/logo5.png')} />
            </div>

            <h1>
                Explain
     </h1>
            <br />
            <br />
            <Form />

            <br />
            <br />
            <br />
            <br />
            <div className="fistDivision">
                <div className="partOfGrid">
                    <div className="divisionImage">
                        <img alt="logo" height="100%" width="120%" src={require('../../../images/whatExplain.png')} />
                    </div>
                    <br />
                    <span className="questionLand">What is Explain?</span>
                    <br />
                    <br />
                    <div className="answerDiv">
                        <span className="answerLand">Explain is a simple tool that allows screen-share/recording functionality within the browser, with some additional features ( talk to us, please)</span>

                    </div>
                </div>
                <div className="partOfGrid">
                    <div className="divisionImage">
                        <img alt="logo" height="100%" width="100%" src={require('../../../images/whyExplain.png')} />

                    </div>
                    <br />
                    <span className="questionLand">Why Explain?</span>
                    <br />
                    <br />
                    <div className="answerDiv">
                        <span className="answerLand">There is a lot of explanation happening on a daily basis, within a team, between 2 remote workers, between employees within a company. What if these interactions were recorded and kept in order for reference for our future use. Explain helps you to do that with convenience.</span>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <br />
            <br/>
            <br/>
            <span className="questionLand">Can you show me the sample workflow?</span>
            <br />
            <br />
            <span className="answerLand">Yeah Sure , here check this below</span>
            <br />
            <br />
            <div style={{ height: "auto" }}>
                <div className="videoContainerDemo" >
                    <video width="100%"src={require('../../../audio/explainDemo.mp4')} loop controls={false} muted autoPlay>
                    </video>
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <span className="questionLand"> What is explain roadmap?</span>
            <br />
            <br />
            <br />
            <div className="roadMapDiv">
                <div>
                    <span className="answerLand">Explain wants to connect creators/tinkerers/part timers/subject matter experts to users who need help immediately. Of course we want the helpers earn for their time.</span>

                </div>
                <br />

                <div>
                    <span className="answerLand">Example: Imagine you are on stackoverflow, code is there, what if someone really explains it online to you, give you a clear understanding, and the helper is rewarded for his time.</span>

                </div>
                <br />

                <div>
                    <span className="answerLand">We want to work with creators/tinkerers , help them gain more mileage, invent tools / apps that help them focus on creations, by giving them support systems that value their time and skillset.
                </span>

                </div>

            </div>
            <br />
            <br />
            <br />
            <br />
            <div className="footerDiv">
                <br />
                <br />
                <h2>Alright then, tell us if you are interested and if we can notify you to test out our app</h2>
                <br />
                <h2 style={{ color: "rgb(114, 113, 113)" }}>Lets get started!!!</h2>

                <Form />
            </div>
            <br />

        </div>


    )
}
