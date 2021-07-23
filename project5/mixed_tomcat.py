import sys, time, random
from locust import HttpUser, task, between

class MyUser(HttpUser):
    wait_time = between(0.5, 1)

    @task(4)
    def read(self):
        # generate a random postid between 1 and 100
        postid = random.randint(1, 500)
        self.client.get("/editor/post?action=open&username=cs144&postid=" + str(postid), name="/editor/post?action=open")

    @task(1)
    def write(self):
        # generate a random postid between 1 and 100
        postid = random.randint(1, 500)
        self.client.post(f"/editor/post?action=save&username=cs144&postid={postid}&title=Hello&body=***World!***", name="/editor/post?action=save")
