import React, { Component } from 'react';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            csv: '',
            fileReturn: false
        }
        //binding because you can't just use "this" in js in a lifecycle method cuz it references the library class in this context.
        //Thanks Obama! and Scott and Brian lol.
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
    }
    onFormSubmit(e) {
        e.preventDefault();
        console.log(this.state.csv);
        axios.post('/csv-upload', {
            csv: this.state.csv
        }).then(resp => {
            console.log('wasssap', resp);
        })
      }
    onChange(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        let reader = new FileReader();
        reader.onload = (e) => {
          this.setState({
            csv: e.target.result
          })
        };
        reader.readAsDataURL(files[0]);
    }
    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">React Component</div>

                            <div className="card-body">
                                <form onSubmit={this.onFormSubmit}>
                                    <div className="form-group">
                                    <div className="input-group">
                                        <div className="custom-file">
                                            <input name="csv" type="file" className="custom-file-input" onChange={this.onChange} />
                                            <label name="csv" className="custom-file-label" htmlFor="inputGroupFile04">Choose file</label>
                                        </div>
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-primary" type="submit">Upload</button>
                                        </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
