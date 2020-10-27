import React, { Component } from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Button from "@material-ui/core/Button";
import { ChromePicker } from "react-color";
import DraggableColorBox from "./DraggableColorBox";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

const drawerWidth = 340;

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    height : "calc(100vh - 64px)",
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
});

class NewPaletteForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      color: "#008080",
      colors: [
        { color : '#008080' , name : "LightGreen"},
        { color : '#e15764' , name : "LightPink"}
      ],
      colorName : ''
    }
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleAddColor = this.handleAddColor.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClearPalette = this.handleClearPalette.bind(this);
    this.handleRandomColor = this.handleRandomColor.bind(this);
  }

  handleAddColor() {
    let obj = {
      name: this.state.colorName,
      color : this.state.color
    }
    this.setState({
      colors : [...this.state.colors , obj]
    })
  }
  handleRandomColor() {
    let randomColor = `rgba(${Math.floor(Math.random() * 255)} , ${Math.floor(Math.random() * 255)} , ${Math.floor(Math.random() * 255)} , ${Math.random() *  1})`;
    this.setState({
      color : randomColor
    })
  }
  handleDrawerOpen(){
    this.setState({ open: true });
  };

  handleDrawerClose(){
    this.setState({ open: false });
  };
  handleColorChange(color) {
    this.setState({
      color : color.hex
    })
  }
  handleChange(evt) {
    this.setState({
      colorName : evt.target.value,
    })
  }
  handleClearPalette() {
    this.setState({
      colors : []
    })
  }
  componentDidMount() {
    ValidatorForm.addValidationRule("isColorNameUnique", value =>
      this.state.colors.every(
        ({ name }) => name.toLowerCase() !== value.toLowerCase()
      )
    );
    ValidatorForm.addValidationRule("isColorUnique", value =>
      this.state.colors.every(({ color }) => color !== this.state.color)
    );
  }

  render() {
    const { classes } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position='fixed'
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open
          })}
        >
          <Toolbar disableGutters={!open}>
            <IconButton
              color='inherit'
              aria-label='Open drawer'
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' color='inherit' noWrap>
              Persistent drawer
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant='persistent'
          anchor='left'
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Typography variant="h4">Create Your Palette</Typography>
          <Divider />
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick = {this.handleClearPalette}
            >
              Clear Palette
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick = {this.handleRandomColor}
            >
              Random Color
            </Button>
          </div>
          <ChromePicker
            color = {this.state.color}
            onChangeComplete={newColor => this.handleColorChange(newColor)}
          />
          <ValidatorForm
            onSubmit={this.handleAddColor}
            ref="form"
          >
            <TextValidator
                onChange={this.handleChange}
                name="colorName"
                value={this.state.colorName}
                validators={['required' , 'isColorNameUnique','isColorUnique']}
                errorMessages={[
                  'This field is required!',
                  'Color name must be unique!',
                  'Color already used!'
                ]}
            />
            <br/>
            <Button
              type="submit"
              variant="contained" 
              color="primary"
              style={{ background: this.state.color }}
            >
              Add Color
            </Button>
          </ValidatorForm>

          
          
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open
          })}
        >
          <div className={classes.drawerHeader} />
          <div style={{position:"relative" , width:"100%" , height:"100%"}}>
            {this.state.colors.map(color => 
              <DraggableColorBox color={color.color} name={color.name} />
            )}
          </div>
        </main>
      </div>
    );
  }
}
export default withStyles(styles, { withTheme: true })(NewPaletteForm);