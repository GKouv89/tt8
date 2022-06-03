import { React, Component } from 'react'
import { useParams } from 'react-router-dom'

import Image from 'react-bootstrap/Image';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import { getPieceOfContent } from '../data';

export default function ContentWrapper(props) {
    let {thematicID, episodeID, contentID} = useParams();
    return(
        <>
            <Content themid={thematicID} epid={episodeID} contid={contentID}/>
        </>
    );
}

export class Content extends Component{
    constructor(props){
        super(props);
        this.state = {
            type: "",
            content: ""
        };
    }

    async componentDidMount() {
        const path = getPieceOfContent(this.props.contid - 1).path;
        const type = getPieceOfContent(this.props.contid - 1).type;
        if(path !== "" && type == "text"){
            fetch(path)
                .then((response) => response.text())
                .then((text) => this.setState({type:"text", content: text}));
        }else if(path !== "" && type == "img"){
            // fetch(path)
            //     .then(response => response.blob())
            //     .then(imageBlob => {
            //         const imageObjectURL = URL.createObjectURL(imageBlob);
            //         console.log(imageObjectURL);
            //         this.setState({type:"img", content: imageObjectURL});
            //     });
            this.setState({type: "img", content: path});
        }
    }

    render () {
        console.log(this.state.content);
        if(this.state.type == "text"){
            return(
                <>
                    {this.state.content}
                </>
            );
        }else if(this.state.type == "img"){
            return(
                <Image src={this.state.content} alt="image" fluid={true}/>
            );
        }
    }
}