import React = require('react');
import { Link } from '@fluentui/react/lib/Link';
import { IInputs } from './generated/ManifestTypes';
import { EntityReference } from './interface';
import { CSSProperties } from 'react';


export const EntityRecordLink: React.FC<{ context: ComponentFramework.Context<IInputs>, entityReference: EntityReference, style?:CSSProperties }> = (props) => {

    const onClick = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLElement>) => {
        event.stopPropagation();
        event.preventDefault();
        event.nativeEvent.stopImmediatePropagation();
        props.context.navigation.openForm({
          entityName: props.entityReference.entityType,
          entityId: props.entityReference.id,
          openInNewWindow: event.shiftKey || event.ctrlKey
        });
      };

    const label = props.entityReference.name || '(no name)';
    const toolTip = 'Open ' + label;

    return (
        <Link
            title={toolTip}
            style={props.style}
            onClick={onClick}>{props.children || label}</Link>
    )
}