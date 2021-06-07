import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';
import AddDialog from './AddDialog';
import UpdateDialog from './UpdateDialog.js';

class Tabs extends Component 
{
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
  }

  constructor(props) 
  {
    super(props);

    this.state = {
      activeTab: this.props.children[1].props.label,
      sync: props.sync,
      tasks: props.tasks,
      taskToUpdate: ''
    };

    this.showAddDialog = this.showAddDialog.bind(this);
    this.hideAddDialog = this.hideAddDialog.bind(this);

    this.showUpdateDialog = this.showUpdateDialog.bind(this);
    this.hideUpdateDialog = this.hideUpdateDialog.bind(this);
  }

  onClickTabItem = (tab) => {
    this.setState({ activeTab: tab });
  }

  onClickTabContent = (e) => {
    // Check if the clicked element is a paragraph
    if(e.target.tagName === 'P')
      {
        const parent = e.target.parentNode;
        const children = parent.childNodes;
        console.log(children[1].innerHTML);
        let taskName = children[1].innerHTML;

        this.state.tasks.map((task) => {
          if(task.name === taskName)
            this.setState({ taskToUpdate: task });
        })
       
        this.showUpdateDialog();
      }
  }

  showAddDialog = () => {
    this.setState({ showAdd: true });
  };

  hideAddDialog = () => {
    this.setState({ showAdd: false });
  };

  showUpdateDialog = () => {
    this.setState({ showUpdate: true });
  };

  hideUpdateDialog = () => {
    this.setState({ showUpdate: false });
  };

  render() {
    const {
      onClickTabItem,
      onClickTabContent,

      props: {
        children,
      },
      state: {
        activeTab,
      }
    } = this;

    return (
        <div className="tabs">
          <AddDialog show={this.state.showAdd} handleClose={this.hideAddDialog} sync={this.state.sync}>
            <p>Add a new task</p>
          </AddDialog>
          <button className="btn" onClick={this.showAddDialog}>Add</button>
          <UpdateDialog 
            show={this.state.showUpdate} 
            handleClose={this.hideUpdateDialog} 
            sync={this.state.sync}
            task={this.state.taskToUpdate}
          >
            <p>Update the task</p>
          </UpdateDialog>
          <ol className="tab-list">
            {children.map((child) => {
              const { label } = child.props;

              return (
                <Tab
                  activeTab={activeTab}
                  key={label}
                  label={label}
                  onClick={onClickTabItem}
                />
              );
            })}
          </ol>
          <div className="tab-content" onClick={onClickTabContent}>
            {children.map((child) => {
              if (child.props.label !== activeTab) 
                  return undefined;
              
              return child.props.children;
            })}
          </div>
        </div>
    );
  }
}

export default Tabs;