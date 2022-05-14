import { React, Component } from 'react'
import { useParams } from 'react-router-dom'

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
            content: ""
        };
    }

    async componentDidMount() {
        const path = getPieceOfContent(this.props.contid - 1).path;
        fetch(path)
            .then((response) => response.text())
            .then((text) => this.setState({content: text}));
    }

    render () {
        return(
            <>
            {this.state.content}
            </>
        );
    }
}