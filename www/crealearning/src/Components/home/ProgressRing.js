import React, { Component } from 'react'
import cookie from 'react-cookies'
import {fetchApi} from "../../Utils/Fetch";

/*Le style de ce component est définit dans le fichier UserMenu.scss*/

class ProgressRing extends Component {

    state = {
        percent: 0
    }

    constructor(props) {
        super(props);
        const { radius, stroke } = this.props;
        this.normalizedRadius = radius - stroke * 2;
        this.circumference = this.normalizedRadius * 2 * Math.PI;
    }

    componentDidMount = async() => {
        await this.getPercent()
    }

    async getPercent(){
        let response = await fetchApi('society/quota', 'GET')
        
        if (response){
            let data = await response
            this.setState({percent: data})
        }
    }

    render() {
        const { radius, stroke } = this.props;
        let { percent } = this.state;
        let strokeDashoffset = 0
        if (percent !== undefined) {
            strokeDashoffset = this.circumference - percent['percent'] / 100 * this.circumference;
        }
        
        return (
            <svg
                className='progress__ring'
                height={radius * 2}
                width={radius * 2}
            >
                <title>{percent['used']}Mo / {percent['quota']}Mo</title>
                <circle 
                    cx={ radius }
                    cy={ radius } 
                    r={ this.normalizedRadius } 
                    fill='none' 
                    stroke='#e6e6e6' 
                    strokeWidth={stroke} 
                />
                <circle
                    className='circle__fill'
                    stroke={`rgb(${(percent['percent'] * 2.55)}, ${255 - (percent['percent'] * 2.55)}, 0)`}
                    fill='#f7f7f7'
                    strokeWidth={ stroke }
                    strokeDasharray={ this.circumference + ' ' + this.circumference }
                    style={ { strokeDashoffset } }
                    r={ this.normalizedRadius }
                    cx={ radius }
                    cy={ radius }
                />
                {
                    percent['quota'] === "∞" ?

                        <svg viewBox="-150 0 940 512">
                            <path fill="currentColor"
                                  d="M488.88 96C406.31 96 346.21 178.45 320 222.45 293.79 178.45 233.69 96 151.12 96 67.78 96 0 167.78 0 256s67.78 160 151.12 160c82.56 0 142.67-82.45 168.88-126.46C346.21 333.55 406.31 416 488.88 416 572.22 416 640 344.22 640 256S572.22 96 488.88 96zM151.12 384C85.44 384 32 326.58 32 256s53.44-128 119.12-128c78.03 0 136.47 100.61 150.94 128-14.47 27.39-72.9 128-150.94 128zm337.76 0c-78.03 0-136.47-100.61-150.94-128 14.47-27.39 72.91-128 150.94-128C554.56 128 608 185.42 608 256s-53.44 128-119.12 128z"></path>
                        </svg>
                        :
                        <text x='50%' y='50%' textAnchor='middle' stroke='#000'>{percent['percent'] ? percent['percent'] : 0}%</text>
                }
            </svg>
        );
    }
}

export default ProgressRing