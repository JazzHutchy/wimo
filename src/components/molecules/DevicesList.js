import React from "react"
import { Link } from "react-router-dom"
import moment from "moment"
import MobileTearSheet from "../molecules/MobileTearSheet"
import RaisedButton from "material-ui/RaisedButton"
import { List, ListItem } from "material-ui/List"


const DevicePage = ({ devicesData, handleModalClose }) => {
  return (
    <div>
      <MobileTearSheet>
        <List>
          {devicesData.map(device => (
            <ListItem
              leftAvatar={
                <Link to={`/${device.device_id}`}>
                  <RaisedButton
                    onTouchTap={() => {
                      handleModalClose()
                    }}
                    label="Select"
                  />
                </Link>
              }
              primaryText={device.name ? device.name : device.device_id}
              key={device.device_id}
              nestedListStyle={{ backgroundColor: "#d3d3d3" }}
              nestedItems={[
                <div key="device_model">
                  {[
                    <h5 key="header_device_model">Device model</h5>,
                    <p key="value_device_model">{device.model_id}</p>
                  ]}
                </div>,
                <div key="time">
                  {[
                    <h5 key="header_time">Last Online(time)</h5>,
                    <p key="value_time_hours">
                      {moment(device.last_online).format("h:mm A")}
                    </p>,
                    <p key="value_time_further">
                      {moment(device.last_online).format("MMMM Do YYYY")}
                    </p>
                  ]}
                </div>,
                <div key="time_ago">
                  {[
                    <h5 key="header_time_ago">Last Online(ago)</h5>,
                    <p key="value_time_ago">
                      {moment
                        .duration(moment().diff(moment(device.last_online)))
                        .format(
                          "M [months],w [week],d [days],h [hrs], m [min] ago"
                        )}
                    </p>
                  ]}
                </div>
              ]}
            />
          ))}
        </List>
      </MobileTearSheet>
    </div>
  )
}

export default DevicePage
