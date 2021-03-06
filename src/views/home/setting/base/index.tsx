/**
 * 个人中心
 */
import React from 'react'
import './style.scss'
import Avatar from '@/components/avatar'
import userPoster from '@/assets/img/common/user-poster.png'
import { Card, Divider } from 'antd'
import { connect } from 'react-redux'
import { StoreState } from '@/store'
import { UserInfoProps } from '@/store/reducers/user'
import { RouteComponentProps, withRouter } from 'react-router-dom'

const { Meta } = Card

type Props = {
  userInfo: UserInfoProps
}

const BasePage: React.FC<Props & RouteComponentProps> = function ({ userInfo }) {

  const MetaDesc = (
    <div className="meta-desc">
      <div className="loginname">{userInfo.loginName}</div>
      <div>UID : {userInfo.uid}</div>
      <div>Bio : {userInfo.bio}</div>
      <div>Email : {userInfo.email}</div>
      <div>Location : {userInfo.location}</div>
      <div>Registered At : {userInfo.createdAt}</div>
    </div>
  )

  return (
    <div className="setting-base">
      <Divider orientation="left" plain>Personal Center</Divider>
      <Card
        style={{ width: 350 }}
        cover={
          <img
            alt=""
            src={userPoster}
            className="poster"
          />
        }
      >
        <Meta
          avatar={<Avatar src={userInfo.avatarUrl} size="large" />}
          title={userInfo.username}
          description={MetaDesc}
        />
      </Card>
    </div>
  )
}

const mapStateToProps = ({ user }: StoreState): { userInfo: UserInfoProps } => {
  return { userInfo: user.userInfo }
}

export default connect(mapStateToProps)(withRouter(BasePage))
