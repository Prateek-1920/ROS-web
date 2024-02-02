#!/usr/bin/env python3

import rospy
from std_msgs.msg import String

def publisher():
    rospy.init_node('string_publisher', anonymous=True)
    pub = rospy.Publisher('/listener', String, queue_size=10)
    rate = rospy.Rate(1)  # 1 Hz

    while not rospy.is_shutdown():
        message = "Hello, world!"
        rospy.loginfo(message)
        pub.publish(message)
        rate.sleep()

if __name__ == '__main__':
    try:
        publisher()
    except rospy.ROSInterruptException:
        pass
