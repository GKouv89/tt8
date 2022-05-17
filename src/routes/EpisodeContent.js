import { React, Component } from 'react'
import { useParams } from 'react-router-dom'

import Breadcrumb from 'react-bootstrap/Breadcrumb';
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
            content: ""
        };
    }

    async componentDidMount() {
        const path = getPieceOfContent(this.props.contid - 1).path;
        if(path !== ""){
            fetch(path)
                .then((response) => response.text())
                .then((text) => this.setState({content: text}));
        }
    }

    render () {
        return(
            <>
                <ABreadcrumb themid={this.props.themid} epid={this.props.epid} name={getPieceOfContent(this.props.contid -1).name}/>
                {this.state.content}
            </>
        );
    }
}

function ABreadcrumb (props) {
    let themPath = "/" + props.themid;
    let epPath = themPath + "/episodes/" + props.epid;
    return (
      <>
        <Breadcrumb>
          <LinkContainer to = "/">
            <Breadcrumb.Item> Αρχική Σελίδα </Breadcrumb.Item>
          </LinkContainer>
          <LinkContainer to = {themPath}>
              <Breadcrumb.Item> Θεματική Ενότητα {props.themid} </Breadcrumb.Item>
          </LinkContainer>
          <LinkContainer to = {epPath}>
              <Breadcrumb.Item> Επεισόδιο {props.epid} </Breadcrumb.Item>
          </LinkContainer>
          <Breadcrumb.Item active> {props.name} </Breadcrumb.Item>
        </Breadcrumb>
      </>
    );
  }