import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CardGroup from './CardGroup';
import DownloadLink from './DownloadLink';

class ImageDownload extends Component {
  constructor(props) {
    super(props);
    this.returnToImageSelect = this.returnToImageSelect.bind(this);
    this.downloadImages = this.downloadImages.bind(this);
    this.state ={
      indexedScript: undefined,
      selectedVersions: {},
      downloadLink: ''
    }
  }

  componentDidMount() {
    this.getProps()
  }

  getProps() {
    let script = this.props.script;
    let versions = this.props.versions;
    if (script && versions) {
      localStorage.setItem('script', script);
      localStorage.setItem('versions', JSON.stringify(versions));
    } else {
      script = localStorage.getItem('script');
      versions = JSON.parse(localStorage.getItem('versions'));
    }
    this.setState({
      indexedScript: script,
      selectedVersions: versions
    });
    this.getPNGS(script, versions);
  }

  getPNGS = async(script, versions) => {
    const config = {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        script: script,
        versions: versions
      })
    }
    const response = await fetch('http://bramley.design:4000/api/hiRezPrepare', config);
    const body = await response.json();
    this.setState({
      downloadLink: body.downloadLink
    });
  };

  downloadImages = async (event) => {
    event.preventDefault();    
    const config = {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/zip',
        'Content-Type': 'application/zip'
      })
    }
    fetch('http://bramley.design:4000/api/download/' + this.state.downloadLink, config);
  }

  returnToImageSelect(event) {
    event.preventDefault();
    this.props.history.push('/imageSelect');
  }

  render() {
    return (
      <div className="container">
      <AppBar position="fixed" color="default">
        <Toolbar>
          <Typography variant="title" color="inherit">
            <a href="/">MtG Script Automater</a>
          </Typography>
        </Toolbar>
      </AppBar>


        <div className="row">
          <div className="col-12">
            <input type="hidden" name="script" value={this.state.indexedScript} />
            <h4>Entered Script:</h4>
            <p id="baseScript">{this.state.indexedScript}</p>
          </div>
        </div>        

        <div className="row">
          <div className="col-10">
            <ol className="cardList">
              <li>
                {
                  Object
                  .keys(this.state.selectedVersions)
                  .map(key => 
                      <CardGroup
                        key={key}
                        index={key}
                        versionSelect={undefined}
                        details={this.state.selectedVersions[key]}
                        imageDownload={true} 
                      />
                  )
                }
              </li>
            </ol>
          </div>
          <div className="col-2">
            <a href='/imageSelect'><button>Back to Image Select</button></a>
            { this.state.downloadLink ? 
              <DownloadLink link={this.state.downloadLink} /> : 
              null 
            }
          </div>
        </div>

      </div>       
    );
  }
}

export default ImageDownload;