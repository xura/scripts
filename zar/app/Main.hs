{-# LANGUAGE Arrows #-}

module Main where

import Data.List
import Data.Monoid
import Options.Applicative
import Options.Applicative.Arrows

newtype Command =
  SpacesDeploy SpacesDeployOpts
  deriving (Show)

newtype SpacesDeployOpts =
  SpacesDeployOpts
    { filePath :: String --FilePath
    }
  deriving (Show)

spacesDeployOpts :: Parser SpacesDeployOpts
spacesDeployOpts =
  runA $
  proc () ->
  do filePath <- (asA . strOption)
                   (long "filePath" <> metavar "FILE_PATH" <> value "dist")
                   -< ()
     returnA -< SpacesDeployOpts filePath

--spaces :: Parser Command
--spaces = SpacesDeploy <$> argument str (metavar "TARGET...")
spacesParser :: Parser Command
spacesParser =
  runA $
  proc () ->
  do opts <- asA spacesDeployOpts -< ()
     returnA -< SpacesDeploy opts

parser :: Parser Command
parser = subparser (command "deploy" deploy <> commandGroup "DevOps Commands:" <> hidden)

providers :: Parser Command
providers =
  subparser
    (command "spaces" (info spacesParser (progDesc "Deploy a given --file to Digital Ocean Spaces CDN")) <>
     metavar "PROVIDER")

deploy :: ParserInfo Command
deploy = info (providers <**> helper) (progDesc "Issue a deploy command to a PROVIDER")

run :: Command -> IO ()
run (SpacesDeploy filePath) = putStrLn "Hello,!"

opts :: ParserInfo Command
opts = info (parser <**> helper) idm

main :: IO ()
main = execParser opts >>= run