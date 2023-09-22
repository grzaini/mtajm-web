#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Sep 12 12:39:32 2023

@author: Rasoul
"""

import os
import pathlib as p

path = ""
files = []


def main():
    global path, files
    
    path = p.Path("/Users/Rasoul/projects/mtajm/final/audio/")
    for i in path.glob("*"):
        files.append(i)
        
    print(files)
    #print(os.listdir(path))


main()